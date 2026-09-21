/** Only explicit HTTPS YouTube links in the public description become embeds. */
export function propertyVideos(description: string) {
  const videos: { id: string; title: string }[] = [];
  for (const match of description.matchAll(/\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)/g)) {
    try {
      const url = new URL(match[2]);
      if (url.username || url.password || url.port) continue;
      const id = url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : ["www.youtube.com", "youtube.com"].includes(url.hostname) && url.pathname === "/watch"
          ? url.searchParams.get("v")
          : null;
      if (!id || !/^[\w-]{11}$/.test(id) || videos.some((video) => video.id === id)) continue;
      videos.push({ id, title: match[1] });
    } catch { /* A malformed public link remains ordinary description text. */ }
  }
  return videos;
}
