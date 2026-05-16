import { html } from "hono/html";
import { layout } from "./layout";
import type { User } from "../models/user";
import { avatar } from "./components/avatar";

export const scoreView = (props: {
  user: User;
  weekStats: {
    user: User;
    score: number;
    maxStreak: number;
    guesses: number;
    correct: number;
    present: number;
    notPresent: number;
    accuracy: number;
  }[];
}) =>
  layout({
    user: props.user,
    body: html`<table class="table">
      <thead>
        <tr>
          <th></th>
          <th class="text-right">Score</th>
          <th class="text-right">Max🔥</th>
          <th class="text-right">Guesses</th>
          <th class="text-right">🟩</th>
          <th class="text-right">🟨</th>
          <th class="text-right">⬛</th>
          <th class="text-right">🎯</th>
        </tr>
      </thead>
      <tbody>
        ${props.weekStats.map(
          (stats) =>
            html`<tr>
              <td>${avatar({ user: props.user })}</td>
              <td class="text-right">${stats.score}</td>
              <td class="text-right">${stats.maxStreak}</td>
              <td class="text-right">${stats.guesses}</td>
              <td class="text-right">${stats.correct}</td>
              <td class="text-right">${stats.present}</td>
              <td class="text-right">${stats.notPresent}</td>
              <td class="text-right">${percent(stats.accuracy)}</td>
            </tr>`,
        )}
      </tbody>
    </table>`,
  });

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percent = (fraction: number) => percentFormatter.format(fraction);
