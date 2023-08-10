const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const readingTime = setReadingTime(article);

  // Use the same styling as the publish information in an article's header
  const badge = document.createElement("p");
  badge.classList.add('color-secondary-text', 'type--caption');
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Heading
  const heading = article.querySelector('h1');
  // Heading with date
  const date = article.querySelector('time')?.parentNode;

  (date ?? heading).insertAdjacentElement('afterend', badge);
}

function setReadingTime(article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp); // matchAll returns an iterator
  const wordCount = [...words].length; // convert to array to get word count
  return Math.round(wordCount / 200); // Reading time
}
