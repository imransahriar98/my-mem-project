"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadPage() {
  const [session, setSession] = useState(null);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("image"); // 'image' or 'video'
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!session) return <p>Please <a href="/login">login</a> to upload.</p>;

  const user = session.user;

  async function handleUpload() {
    if (!file) return alert("Choose a file");
    setUploading(true);
    try {
      let media_url = "";
      if (type === "image") {
        if (!file.type.startsWith("image/")) throw new Error("Please select an image file");
        const { data, error } = await supabase.storage.from("images")
          .upload(`${user.id}/${Date.now()}-${file.name}`, file, { upsert: false });
        if (error) throw error;
        const { data: pub } = supabase.storage.from("images").getPublicUrl(data.path);
        media_url = pub.publicUrl;
      } else {
        if (!file.type.startsWith("video/")) throw new Error("Please select a video file");
        // Soft client-side check for 30s using video element
        const duration = await getVideoDuration(file);
        if (duration > 31) throw new Error("Video must be 30 seconds or less");
        const { data, error } = await supabase.storage.from("videos")
          .upload(`${user.id}/${Date.now()}-${file.name}`, file, { upsert: false });
        if (error) throw error;
        const { data: pub } = supabase.storage.from("videos").getPublicUrl(data.path);
        media_url = pub.publicUrl;
      }

      const { error: insertErr } = await supabase.from("posts").insert({
        author_id: user.id,
        media_type: type,
        media_url,
        caption,
      });
      if (insertErr) throw insertErr;
      alert("Uploaded!");
      setCaption("");
      setFile(null);
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
  }

  return (
    <div>
      <h1>Upload</h1>
      <div style={{display:'flex', gap:12, marginBottom: 12}}>
        <label><input type="radio" name="t" value="image" checked={type==='image'} onChange={()=>setType('image')} /> Image</label>
        <label><input type="radio" name="t" value="video" checked={type==='video'} onChange={()=>setType('video')} /> Video (≤30s)</label>
      </div>
      <input type="file" accept={type==='image' ? 'image/*' : 'video/*'} onChange={onFileChange} />
      <div style={{marginTop:12}}>
        <input placeholder="Write a funny caption..." value={caption} onChange={e=>setCaption(e.target.value)} style={{width:'100%', padding:8}} />
      </div>
      <button onClick={handleUpload} disabled={uploading} style={{marginTop:12}}>
        {uploading ? "Uploading..." : "Publish"}
      </button>
    </div>
  );
}

function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration || 0);
    };
    video.onerror = reject;
    video.src = url;
  });
}
