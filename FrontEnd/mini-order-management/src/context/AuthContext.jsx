/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import * as authServices from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const getStored = () => {
		const lsUser = localStorage.getItem("user");
		const ssUser = sessionStorage.getItem("user");
		const user = lsUser ? JSON.parse(lsUser) : ssUser ? JSON.parse(ssUser) : null;
		const token = localStorage.getItem("token") || sessionStorage.getItem("token") || null;
		return { user, token };
	};

	const initial = getStored();
	const [user, setUser] = useState(initial.user);
	const [token, setToken] = useState(initial.token);

	const persist = (u, t, remember) => {
		setUser(u);
		setToken(t);
		const target = remember ? localStorage : sessionStorage;
		target.setItem("user", JSON.stringify(u));
		target.setItem("token", t);
		// clear the other storage to avoid stale duplicates
		if (remember) {
			sessionStorage.removeItem("user");
			sessionStorage.removeItem("token");
		} else {
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		}
	};

	const login = async (username, password, remember = false) => {
		const data = await authServices.login(username, password);
		const u = { username: data.username, email: data.email };
		persist(u, data.token, remember);
		return data;
	};

	const register = async (username, email, password, remember = false) => {
		const res = await authServices.register(username, email, password);
		// Try to auto-login after successful register. If it fails, ignore.
		try {
			await login(username, password, remember);
		} catch {
			// no-op
		}
		return res;
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		sessionStorage.removeItem("user");
		sessionStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;

