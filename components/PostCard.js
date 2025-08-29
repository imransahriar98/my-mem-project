"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [session, setSession] = useState(null);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch count and whether the user liked
    async function init() {
      const { count } = await supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", post.id);
      setLikesCount(count || 0);
      const uid = (await supabase.auth.getUser()).data.user?.id;
      if (uid) {
        const { data } = await supabase.from("likes").select("post_id").eq("post_id", post.id).eq("user_id", uid).maybeSingle();
        setLiked(!!data);
      }
    }
    init();
  }, [post.id]);

  async function toggleLike() {
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return alert("Login to like posts");
    if (liked) {
      const { error } = await supabase.from("likes").delete().eq("user_id", uid).eq("post_id", post.id);
      if (!error) { setLiked(false); setLikesCount(c=>Math.max(0, c-1)); }
    } else {
      const { error } = await supabase.from("likes").insert({ user_id: uid, post_id: post.id });
      if (!error) { setLiked(true); setLikesCount(c=>c+1); }
    }
  }

  return (
    <article style={{border:'1px solid #eee', borderRadius:12, margin:'12px 0', overflow:'hidden'}}>
      <div style={{padding:'8px 12px', fontSize:14, opacity:0.8}}>
        {new Date(post.created_at).toLocaleString()}
      </div>
      <div style={{background:'#000'}}>
        {post.media_type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.media_url} alt="meme" style={{width:'100%'}} />
        ) : (
          <video src={post.media_url} controls playsInline style={{width:'100%'}} preload="metadata" />
        )}
      </div>
      <div style={{padding:12}}>
        <p style={{margin:'8px 0'}}>{post.caption}</p>
        <button onClick={toggleLike}>{liked ? "♥ Liked" : "♡ Like"} ({likesCount})</button>
      </div>
    </article>
  );
}
