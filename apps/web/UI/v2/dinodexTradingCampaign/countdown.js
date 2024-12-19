const CountDown = {
  targetDate: new Date(),
  start: function (targetDate, { onDays, onHours, onMinutes, onSeconds }) {
    this.targetDate = targetDate
    const countdownTimer = setInterval(() => {
      const isComplete = this.updateAllSegments();

      if (isComplete) {
        clearInterval(countdownTimer);
      }
    }, 1000)
    this.updateAllSegments();
  },
  updateAllSegments: function () {
    const timeRemainingBits = this.getTimeRemaining(
      new Date(this.targetDate).getTime()
    );

    this.updateTimeSection('seconds', timeRemainingBits.seconds);
    this.updateTimeSection('minutes', timeRemainingBits.minutes);
    this.updateTimeSection('hours', timeRemainingBits.hours);
    this.updateTimeSection('days', timeRemainingBits.days);

    return timeRemainingBits.complete;
  },
  getTimeRemaining: function (targetDateTime) {
    const nowTime = Date.now();
    const complete = nowTime >= targetDateTime;

    if (complete) {
      return {
        complete,
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0
      };
    }

    const secondsRemaining = Math.floor(
      (targetDateTime - nowTime) / 1000
    );

    const days = Math.floor(secondsRemaining / 60 / 60 / 24);
    const secondsRemainingWithoutDays = secondsRemaining - days * 24 * 60 * 60;

    const hours = Math.floor(secondsRemainingWithoutDays / 60 / 60);
    const secondsRemainingWithoutHours = secondsRemainingWithoutDays - hours * 60 * 60;
    const minutes =
      Math.floor(secondsRemainingWithoutHours / 60);
    const seconds = secondsRemainingWithoutHours % 60;

    return {
      complete,
      seconds: seconds.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      days: days.toString().padStart(2, '0'),
    };
  },
  updateTimeSection: function (sectionID, timeValue) {
    const sectionElement = document.getElementById(sectionID);
    this.updateTimeSegment(sectionElement, timeValue);
  },
  updateTimeSegment: function (segmentElement, timeValue) {
    const segmentElements =
      this.getTimeSegmentElements(segmentElement);
    if (
      parseInt(
        segmentElements.segmentDisplayTop.textContent,
        10
      ) === parseInt(
        timeValue,
        10
      )
    ) {
      return;
    }

    segmentElements.segmentOverlay.classList.add('flip');
    this.updateSegmentValues(
      segmentElements.segmentDisplayTop,
      segmentElements.segmentOverlayBottom,
      timeValue
    );

    const finishAnimation = () => {
      segmentElements.segmentOverlay.classList.remove('flip');
      this.updateSegmentValues(
        segmentElements.segmentDisplayBottom,
        segmentElements.segmentOverlayTop,
        timeValue
      );

      segmentElements.segmentOverlay.removeEventListener(
        'animationend',
        finishAnimation
      );
    }

    segmentElements.segmentOverlay.addEventListener(
      'animationend',
      finishAnimation
    );
  },
  updateSegmentValues: function (
    displayElement,
    overlayElement,
    value
  ) {

    displayElement.textContent = value;
    overlayElement.textContent = value;
  },
  getTimeSegmentElements: function (segmentElement) {
    const segmentDisplay = segmentElement.querySelector(
      '.number-display'
    );
    const segmentDisplayTop = segmentDisplay.querySelector(
      '.number-display__top > span'
    );
    const segmentDisplayBottom = segmentDisplay.querySelector(
      '.number-display__bottom > span'
    );

    const segmentOverlay = segmentElement.querySelector(
      '.number-overlay'
    );
    const segmentOverlayTop = segmentOverlay.querySelector(
      '.number-overlay__top > span'
    );
    const segmentOverlayBottom = segmentOverlay.querySelector(
      '.number-overlay__bottom >span'
    );

    return {
      segmentDisplayTop,
      segmentDisplayBottom,
      segmentOverlay,
      segmentOverlayTop,
      segmentOverlayBottom,
    };
  }
}


CountDown.start(new Date("01/01/2025"), {
  onHour: (hour) => {

  }
})