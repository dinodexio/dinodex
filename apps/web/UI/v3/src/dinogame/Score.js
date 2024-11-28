export default class Score {
  score = 0;
  hasSetTotalScore = false;
  HIGH_SCORE_KEY = 'highScore';
  SCORE_KEY = 'score';
  TOTAL_SCORE_KEY = 'totalScore';

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(frameTimeDelta) {
    this.score += frameTimeDelta * 0.01;
  }

  reset() {
    this.score = 0;
    this.hasSetTotalScore = false;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  // setScore() {
  //   localStorage.setItem(this.SCORE_KEY, Math.floor(this.score));
  // }

  setTotalScore() {
    let totalScore = Number(localStorage.getItem(this.TOTAL_SCORE_KEY)) || 0;
    totalScore += Math.floor(this.score);
    localStorage.setItem(this.TOTAL_SCORE_KEY, totalScore);
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const totalScore = Number(localStorage.getItem(this.TOTAL_SCORE_KEY)) || 0;
    const y = 25 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';
    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;
    const totalScoreX = scoreX - 295 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);
    const totalScorePadded = totalScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(`TOTAL ${totalScorePadded}`, totalScoreX, y);
  }
}
