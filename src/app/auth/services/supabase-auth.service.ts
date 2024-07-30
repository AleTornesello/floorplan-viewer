import {Injectable} from '@angular/core';
import {AuthChangeEvent, AuthSession, createClient, Session, SupabaseClient,} from '@supabase/supabase-js';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  private _supabase: SupabaseClient;

  constructor() {
    this._session = null;
    this._supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  private _session: AuthSession | null;

  public get session() {
    this._supabase.auth.getSession().then(({data}) => {
      this._session = data.session;
    });
    return this._session;
  }

  public authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this._supabase.auth.onAuthStateChange(callback);
  }

  public signIn(email: string, password: string) {
    return this._supabase.auth.signInWithPassword({email, password});
  }

  public signOut() {
    return this._supabase.auth.signOut();
  }

  public signUp(email: string, password: string, emailRedirectTo?: string) {
    return this._supabase.auth.signUp({
      email, password, options: emailRedirectTo
        ? {
          emailRedirectTo
        }
        : undefined
    });
  }
}
