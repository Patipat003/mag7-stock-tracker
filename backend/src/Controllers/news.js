import yahooFinance from "yahoo-finance2";

export const getNews = async (req, res) => {
  try {
    const { symbol } = req.params;
    const query = symbol;

    const news = await yahooFinance.search(query, { newsCount: 10 });

    const articles = (news.news || []).map((n) => {
      const providerPublishTime = new Date(n.providerPublishTime);
      const formattedTime = isNaN(providerPublishTime.getTime())
        ? null
        : providerPublishTime.toISOString();

      return {
        title: n.title,
        link: n.link,
        publisher: n.publisher,
        providerPublishTime: formattedTime,
      };
    });

    articles.sort((a, b) => {
      const dateA = a.providerPublishTime
        ? new Date(a.providerPublishTime).getTime()
        : 0;
      const dateB = b.providerPublishTime
        ? new Date(b.providerPublishTime).getTime()
        : 0;
      return dateB - dateA;
    });

    res.json(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};
