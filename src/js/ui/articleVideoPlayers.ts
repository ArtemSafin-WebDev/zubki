import ArticleVideoPlayer from "../classes/components/ArticleVideoPlayer";

export default function articleVideoPlayers() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-article-video-player")
  );

  elements.forEach((element) => {
    if (ArticleVideoPlayer.getInstanceFor(element)) return;
    new ArticleVideoPlayer(element);
  });
}
