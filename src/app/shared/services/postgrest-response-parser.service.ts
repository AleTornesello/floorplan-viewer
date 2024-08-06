import {Injectable} from '@angular/core';
import {PostgrestResponse} from "@supabase/supabase-js";

@Injectable({
  providedIn: 'root'
})
export class PostgrestResponseParserService {

  constructor() {
  }

  parse<T, R>(response: PostgrestResponse<T>, parser: (data: T) => R): PostgrestResponse<R> {
    if (response.error) {
      return response;
    }

    return {
      ...response,
      data: response.data?.map(parser) as R[]
    };
  }
}