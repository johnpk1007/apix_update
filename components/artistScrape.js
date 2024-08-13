import * as cheerio from "cheerio";
import axios from "axios";

export async function artistScrape(artist) {
  try {
    let content = [];
    const url = `https://www.billboard.com/artist/${artist}/chart-history/hsi/`;
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const image = $(
      "div.a-artist-history-page-background > div.artist-info-chart-history"
    );
    const list = $(
      "div.artist-chart-history-container > div.artist-chart-history-items> div.o-chart-results-list-row"
    );
    list.map((idx, el) => {
      content[idx] = {
        title: $(el)
          .find("div:first-child > h3")
          .text()
          .replace(/[\n\t]/g, ""),
        peak_pos: Number(
          $(el)
            .find(
              "div:nth-child(2) > div.o-chart-results-list__item:nth-child(2) > span:first-child"
            )
            .text()
            .replace(/[\n\t]/g, "")
        ),

        peak_date: $(el)
          .find(
            "div:nth-child(2) > div.o-chart-results-list__item:nth-child(3) > span > a"
          )
          .text()
          .replace(/[\n\t]/g, ""),
        wks_on_chart: Number(
          $(el)
            .find(
              "div:nth-child(2) > div.o-chart-results-list__item:nth-child(4) > span"
            )
            .text()
            .replace(/[\n\t]/g, "")
        ),
        video: "",
      };
    });
    content.sort((a, b) => a.peak_pos - b.peak_pos);

    if (content.length > 5) {
      const slicedContent = content.slice(0, 5);
      return {
        artistImage: image.find("img").attr("data-lazy-src"),
        top5songs: slicedContent,
      };
    } else {
      return {
        artistImage: image.find("img").attr("data-lazy-src"),
        top5songs: content,
      };
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
