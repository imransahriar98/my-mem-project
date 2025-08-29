"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  return (
    <div style={{maxWidth: 400, margin: '40px auto'}}>
      <h2>Sign in</h2>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
    </div>
  );
}
