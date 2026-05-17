import { html } from "hono/html";
import { layout } from "./layout";
import type { User } from "../models/user";
import { avatar } from "./components/avatar";

export const scoreView = (props: {
  user: User;
  stats: {
    user: User;
    score: number;
    maxStreak: number;
    guesses: number;
    correct: number;
    present: number;
    notPresent: number;
    accuracy: number;
  }[];
  range: [Date, Date];
}) =>
  layout({
    user: props.user,
    body: html`<table class="table">
      <thead>
        <caption>
          ${date(props.range[0])} - ${date(props.range[1])}<br />
          <code>🎯 = (scored letters) / (total letters)</code>
        </caption>
        <tr>
          <th></th>
          <th class="text-right">Score</th>
          <th class="text-right">🎯</th>
          <th class="text-right">Max 🔥</th>
          <th class="text-right">🟩</th>
          <th class="text-right">🟨</th>
          <th class="text-right">⬛</th>
        </tr>
      </thead>
      <tbody>
        ${props.stats.map(
          (stats) =>
            html`<tr>
              <td>${avatar({ user: stats.user })}</td>
              <td class="text-right">${stats.score}</td>
              <td class="text-right">${percent(stats.accuracy)}</td>
              <td class="text-right">${stats.maxStreak}</td>
              <td class="text-right">${stats.correct}</td>
              <td class="text-right">${stats.present}</td>
              <td class="text-right">${stats.notPresent}</td>
            </tr>`,
        )}
      </tbody>
    </table>`,
  });

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percent = (fraction: number) => percentFormatter.format(fraction);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "short",
});
const date = (raw: Date) => dateFormatter.format(raw);
