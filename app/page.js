"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PostCard from "@/components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(0);

  const pageSize = 10;

  async function loadMore(reset=false) {
    setLoading(true);
    const start = reset ? 0 : from;
    const end = start + pageSize - 1;
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(start, end);
    if (error) console.error(error);
    setPosts(reset ? (data || []) : [...posts, ...(data || [])]);
    setFrom(end + 1);
    setLoading(false);
  }

  useEffect(() => { loadMore(true); }, []);

  return (
    <div>
      <h1>🔥 Memely — Feed</h1>
      {posts.map(p => <PostCard key={p.id} post={p} />)}
      <div style={{textAlign:'center', marginTop: 16}}>
        <button onClick={() => loadMore(false)} disabled={loading}>
          {loading ? "Loading..." : "Load more"}
        </button>
      </div>
    </div>
  );
}
