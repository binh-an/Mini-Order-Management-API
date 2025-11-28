using System.Net;
using System.Text.Json;
using Helpers.Exceptions;

namespace Middlewares
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            // Default 500
            var code = HttpStatusCode.InternalServerError;
            var resultObj = new { message = "Internal server error" };

            // Map domain exceptions to HTTP codes
            if (ex is BusinessException) // e.g. validation / domain rule
            {
                code = HttpStatusCode.BadRequest; // 400
                resultObj = new { message = ex.Message };
            }
            else if (ex is NotFoundException)
            {
                code = HttpStatusCode.NotFound; // 404
                resultObj = new { message = ex.Message };
            }
            else if (ex is UnauthorizedAccessException)
            {
                code = HttpStatusCode.Forbidden; // 403
                resultObj = new { message = ex.Message };
            }
            

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(JsonSerializer.Serialize(resultObj));
        }
    }
}
