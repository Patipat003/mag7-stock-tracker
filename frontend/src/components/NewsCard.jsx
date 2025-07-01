const formatDate = (date) => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const NewsCard = ({ news }) => {
  return (
    <div className="rounded-lg shadow-md">
      <p className="text-sm text-gray-500 mb-2">
        {news.publisher}, {formatDate(news.providerPublishTime)}
      </p>
      <a
        href={news.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg text-white"
      >
        {news.title}
      </a>
      <div className="divider"></div>
    </div>
  );
};

export default NewsCard;
