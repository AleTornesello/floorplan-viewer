import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private readonly _supabase: SupabaseClient;

  constructor() {
    this._supabase = this._getSupabaseClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  private _getSupabaseClient(url: string, key: string) {
    return createClient(url, key, {
      auth: {
        autoRefreshToken: true,
      },
    });
  }

  public get supabase(): SupabaseClient {
    return this._supabase;
  }
}
