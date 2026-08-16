import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, clearToken, setToken, getToken } from '../services/apiClient';

export interface UserProfile { id:string; name:string; email:string; role:string; avatar:string; department:string; lastLogin:string; }
interface AuthContextType { user:UserProfile|null; isAuthenticated:boolean; isLoading:boolean; login:(email:string,pass:string,rememberMe?:boolean)=>Promise<{success:boolean;message?:string}>; register:(name:string,email:string,pass:string)=>Promise<{success:boolean;message?:string}>; logout:()=>void; updateProfile:(updated:Partial<UserProfile>)=>Promise<void>; }
const AuthContext=createContext<AuthContextType|undefined>(undefined);

export const AuthProvider:React.FC<{children:React.ReactNode}>=({children})=>{
 const [user,setUser]=useState<UserProfile|null>(null); const [isLoading,setIsLoading]=useState(true);
 useEffect(()=>{(async()=>{if(!getToken()){setIsLoading(false);return;} try{const r=await apiFetch<{user:UserProfile}>('/auth/me');setUser(r.user);}catch{clearToken();setUser(null);}finally{setIsLoading(false);}})();},[]);
 const login=async(email:string,pass:string,rememberMe=true)=>{try{const r=await apiFetch<{user:UserProfile;token:string}>('/auth/login',{method:'POST',body:JSON.stringify({email, password:pass})});setToken(r.token,rememberMe);setUser(r.user);return {success:true};}catch(e){return {success:false,message:e instanceof Error?e.message:'Authentication failed.'};}};
 const register=async(name:string,email:string,pass:string)=>{try{const r=await apiFetch<{user:UserProfile;token:string}>('/auth/register',{method:'POST',body:JSON.stringify({name,email,password:pass})});setToken(r.token,true);setUser(r.user);return {success:true};}catch(e){return {success:false,message:e instanceof Error?e.message:'Registration failed.'};}};
 const logout=()=>{clearToken();setUser(null);};
 const updateProfile=async(updated:Partial<UserProfile>)=>{if(!user)return;const r=await apiFetch<{user:UserProfile}>('/auth/profile',{method:'PUT',body:JSON.stringify({name:updated.name??user.name,email:updated.email??user.email,department:updated.department??user.department})});setUser(r.user);};
 return <AuthContext.Provider value={{user,isAuthenticated:!!user,isLoading,login,register,logout,updateProfile}}>{children}</AuthContext.Provider>;
};
export const useAuth=()=>{const c=useContext(AuthContext);if(!c)throw new Error('useAuth must be used within an AuthProvider');return c;};
