import * as cheerio from "cheerio";
import axios from "axios";

export async function scrape() {
  let content = [];
  const url = "https://www.billboard.com/charts/hot-100/";
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const list = $(
    "div.chart-results-list > div.o-chart-results-list-row-container"
  );

  list.map((idx, el) => {
    content[idx] = {
      this_week: $(el)
        .find(
          "ul.o-chart-results-list-row > li.o-chart-results-list__item:first-child > span"
        )
        .text()
        .replace(/[^\d]/g, ""),
      title: $(el)
        .find(
          "ul.o-chart-results-list-row > li.lrv-u-width-100p > ul.lrv-a-unstyle-list > li.o-chart-results-list__item:first-child > h3"
        )
        .text()
        .replace(/[\n\t]/g, ""),
      artist: $(el)
        .find(
          "ul.o-chart-results-list-row > li.lrv-u-width-100p > ul.lrv-a-unstyle-list > li.o-chart-results-list__item:first-child > span"
        )
        .text()
        .replace(/[\n\t]/g, ""),
      last_week: $(el)
        .find(
          "ul.o-chart-results-list-row > li.lrv-u-width-100p > ul.lrv-a-unstyle-list > li.o-chart-results-list__item:nth-child(4) > span"
        )
        .text()
        .replace(/[\n\t]/g, ""),
      peak_pos: $(el)
        .find(
          "ul.o-chart-results-list-row > li.lrv-u-width-100p > ul.lrv-a-unstyle-list > li.o-chart-results-list__item:nth-child(5) > span"
        )
        .text()
        .replace(/[\n\t]/g, ""),
      wks_on_chart: $(el)
        .find(
          "ul.o-chart-results-list-row > li.lrv-u-width-100p > ul.lrv-a-unstyle-list > li.o-chart-results-list__item:nth-child(6) > span"
        )
        .text()
        .replace(/[\n\t]/g, ""),
      video: "",
    };
  });
  return content;
}
