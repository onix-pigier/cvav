"use client";

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Notification {
  _id: string;
  titre: string;
  message: string;
  lien?: string;
  lu: boolean;
  type: "info" | "succes" | "erreur";
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      toast.error('Erreur chargement notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, lu: true } : n)
        );
        toast.success('Notification marquée comme lue');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ all: true })
      });
      
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
        toast.success('Toutes les notifications marquées comme lues');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm('Supprimer cette notification ?')) return;
    
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        toast.success('Notification supprimée');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const filtered = filter === 'unread' 
    ? notifications.filter(n => !n.lu)
    : notifications;

  const nonLues = notifications.filter(n => !n.lu).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "succes": return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case "erreur": return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBg = (type: string, lu: boolean) => {
    const base = lu ? 'bg-white' : 'bg-blue-50';
    return base;
  };

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Notifications</h1>
              <p className="text-sm text-slate-600 mt-1">
                {nonLues} non lue(s) · {notifications.length} total
              </p>
            </div>

            {nonLues > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Non lues ({nonLues})
            </button>
          </div>

          {/* Liste notifications */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">Aucune notification</p>
              </div>
            ) : (
              filtered.map((notif) => (
                <div
                  key={notif._id}
                  className={`${getBg(notif.type, notif.lu)} rounded-xl border ${notif.lu ? 'border-slate-200' : 'border-blue-200'} p-4 hover:shadow-md transition-all`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-sm">
                            {notif.titre}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(notif.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {!notif.lu && (
                            <button
                              onClick={() => markAsRead(notif._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Marquer comme lue"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {notif.lien && (
                        <a
                          href={notif.lien}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
                        >
                          Voir détails →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}