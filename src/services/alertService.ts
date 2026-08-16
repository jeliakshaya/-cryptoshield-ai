import { apiFetch } from './apiClient';
import { SecurityAlert } from '../types/crypto';
class AlertService { private alerts:SecurityAlert[]=[]; async load(){const r=await apiFetch<{alerts:SecurityAlert[]}>('/alerts');this.alerts=r.alerts;return this.alerts;} getAll(){return [...this.alerts];} async updateAlertStatus(id:string,status:SecurityAlert['status']){const r=await apiFetch<{alert:SecurityAlert}>(`/alerts/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});this.alerts=this.alerts.map(a=>a.id===id?r.alert:a);return r.alert;} getUnreadCount(){return this.alerts.filter(a=>a.status==='open'||a.status==='investigating').length;} async unreadCount(){const r=await apiFetch<{count:number}>('/alerts/unread-count');return r.count;} }
export const alertService=new AlertService();
