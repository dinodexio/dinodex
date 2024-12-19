// apps/web/components/campaign/components/CountDown.tsx
import React, { useEffect, useRef } from 'react';
import styleCountDown from './countDown.module.css';

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const refDisplayTopDays = useRef<HTMLDivElement>(null);
  const refDisplayBottomDays = useRef<HTMLDivElement>(null);
  const refOverlayTopDays = useRef<HTMLDivElement>(null);
  const refOverlayBottomDays = useRef<HTMLDivElement>(null);

  const refDisplayTopHours = useRef<HTMLDivElement>(null);
  const refDisplayBottomHours = useRef<HTMLDivElement>(null);
  const refOverlayTopHours = useRef<HTMLDivElement>(null);
  const refOverlayBottomHours = useRef<HTMLDivElement>(null);

  const refDisplayTopMinutes = useRef<HTMLDivElement>(null);
  const refDisplayBottomMinutes = useRef<HTMLDivElement>(null);
  const refOverlayTopMinutes = useRef<HTMLDivElement>(null);
  const refOverlayBottomMinutes = useRef<HTMLDivElement>(null);

  const refDisplayTopSeconds = useRef<HTMLDivElement>(null);
  const refDisplayBottomSeconds = useRef<HTMLDivElement>(null);
  const refOverlayTopSeconds = useRef<HTMLDivElement>(null);
  const refOverlayBottomSeconds = useRef<HTMLDivElement>(null);

  const refDays = useRef<HTMLDivElement>(null);
  const refHours = useRef<HTMLDivElement>(null);
  const refMinutes = useRef<HTMLDivElement>(null);
  const refSeconds = useRef<HTMLDivElement>(null);

  const CountDown = {
    targetDate: new Date(),
    start: function (targetDate: Date) {
      this.targetDate = targetDate;
      const countdownTimer = setInterval(() => {
        const isComplete = this.updateAllSegments();

        if (isComplete) {
          clearInterval(countdownTimer);
        }
      }, 1000);
      this.updateAllSegments();
    },
    updateAllSegments: function (): boolean {
      const timeRemainingBits = this.getTimeRemaining(
        new Date(this.targetDate).getTime()
      );

      this.updateTimeSection('seconds', timeRemainingBits.seconds);
      this.updateTimeSection('minutes', timeRemainingBits.minutes);
      this.updateTimeSection('hours', timeRemainingBits.hours);
      this.updateTimeSection('days', timeRemainingBits.days);

      return timeRemainingBits.complete;
    },
    getTimeRemaining: function (targetDateTime: number): { complete: boolean; seconds: string; minutes: string; hours: string; days: string; } {
      const nowTime = Date.now();
      const complete = nowTime >= targetDateTime;

      if (complete) {
        return {
          complete,
          seconds: '00',
          minutes: '00',
          hours: '00',
          days: '00'
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
    updateTimeSection: function (sectionID: string, timeValue: string) {
      let sectionElement: HTMLElement | null = null;
      switch (sectionID) {
        case 'days':
          sectionElement = refDays.current;
          break;
        case 'hours':
          sectionElement = refHours.current;
          break;
        case 'minutes':
          sectionElement = refMinutes.current;
          break;
        case 'seconds':
          sectionElement = refSeconds.current;
          break;
      }
      if (sectionElement) {
        this.updateTimeSegment(sectionElement, timeValue);
      }
    },
    updateTimeSegment: function (segmentElement: HTMLElement, timeValue: string) {
      const segmentElements = this.getTimeSegmentElements(segmentElement);
      if (
        parseInt(
          segmentElements.segmentDisplayTop.textContent || '',
          10
        ) === parseInt(
          timeValue,
          10
        )
      ) {
        return;
      }

      segmentElements.segmentOverlay.classList.add(`${styleCountDown["flip"]}`);
      this.updateSegmentValues(
        segmentElements.segmentDisplayTop,
        segmentElements.segmentOverlayBottom,
        timeValue
      );

      const finishAnimation = () => {
        segmentElements.segmentOverlay.classList.remove(`${styleCountDown["flip"]}`);
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
      displayElement: HTMLElement,
      overlayElement: HTMLElement,
      value: string
    ) {
      if (displayElement && overlayElement) {
        displayElement.textContent = value;
        overlayElement.textContent = value;
      } else {
      }
    },
    getTimeSegmentElements: function (segmentElement: HTMLElement) {
      const segmentDisplay = segmentElement.querySelector(
        '.number-display'
      ) as HTMLElement;
      const segmentDisplayTop = segmentDisplay.querySelector(
        '.number-display__top > span'
      ) as HTMLElement;
      const segmentDisplayBottom = segmentDisplay.querySelector(
        '.number-display__bottom > span'
      ) as HTMLElement;

      const segmentOverlay = segmentElement.querySelector(
        '.number-overlay'
      ) as HTMLElement;
      const segmentOverlayTop = segmentOverlay.querySelector(
        '.number-overlay__top > span'
      ) as HTMLElement;
      const segmentOverlayBottom = segmentOverlay.querySelector(
        '.number-overlay__bottom >span'
      ) as HTMLElement;

      return {
        segmentDisplayTop,
        segmentDisplayBottom,
        segmentOverlay,
        segmentOverlayTop,
        segmentOverlayBottom,
      };
    }
  }

  useEffect(() => {
    if (refDays.current) {
      CountDown.start(new Date(targetDate))
    }
  }, [targetDate, refDays]);

  return (
    <div className={styleCountDown["count-down-campaign"]}>
      <div className={styleCountDown["count-down-item"]} id="days" ref={refDays}>
        <div className={styleCountDown["time-number"]}>
          <div className={`number-display ${styleCountDown["number-display"]}`}>
            <div className={`number-display__top ${styleCountDown["number-display__top"]}`} ref={refDisplayTopDays}>
              <span></span>
            </div>
            <div className={`number-display__bottom ${styleCountDown["number-display__bottom"]}`} ref={refDisplayBottomDays}>
              <span></span>
            </div>
          </div>
          <div className={`number-overlay flip ${styleCountDown["number-overlay"]} ${styleCountDown["flip"]}`}>
            <div className={`number-overlay__top ${`number-overlay__top ${styleCountDown["number-overlay__top"]}`}`} ref={refOverlayTopDays}><span></span></div>
            <div className={`number-overlay__bottom ${styleCountDown["number-overlay__bottom"]}`} ref={refOverlayBottomDays}><span></span></div>
          </div>
        </div>
        <div className={styleCountDown["count-down-text"]}>Days</div>
      </div>
      <div className={styleCountDown["count-down-item"]} id="hours" ref={refHours}>
        <div className={styleCountDown["time-number"]}>
          <div className={`number-display ${styleCountDown["number-display"]}`}>
            <div className={`number-display__top ${styleCountDown["number-display__top"]}`} ref={refDisplayTopHours}>
              <span></span>
            </div>
            <div className={`number-display__bottom ${styleCountDown["number-display__bottom"]}`} ref={refDisplayBottomHours}>
              <span></span>
            </div>
          </div>
          <div className={`number-overlay flip ${styleCountDown["number-overlay"]} ${styleCountDown["flip"]}`}>
            <div className={`number-overlay__top ${styleCountDown["number-overlay__top"]}`} ref={refOverlayTopHours}><span></span></div>
            <div className={`number-overlay__bottom ${styleCountDown["number-overlay__bottom"]}`} ref={refOverlayBottomHours}><span></span></div>
          </div>
        </div>
        <div className={styleCountDown["count-down-text"]}>Hours</div>
      </div>
      <div className={styleCountDown["count-down-item"]} id="minutes" ref={refMinutes}>
        <div className={styleCountDown["time-number"]}>
          <div className={`number-display ${styleCountDown["number-display"]}`}>
            <div className={`number-display__top ${styleCountDown["number-display__top"]}`} ref={refDisplayTopMinutes}>
              <span></span>
            </div>
            <div className={`number-display__bottom ${styleCountDown["number-display__bottom"]}`} ref={refDisplayBottomMinutes}>
              <span></span>
            </div>
          </div>
          <div className={`number-overlay flip ${styleCountDown["number-overlay"]} ${styleCountDown["flip"]}`}>
            <div className={`number-overlay__top ${styleCountDown["number-overlay__top"]}`} ref={refOverlayTopMinutes}><span></span></div>
            <div className={`number-overlay__bottom ${styleCountDown["number-overlay__bottom"]}`} ref={refOverlayBottomMinutes}><span></span></div>
          </div>
        </div>
        <div className={styleCountDown["count-down-text"]}>Minutes</div>
      </div>
      <div className={styleCountDown["count-down-item"]} id="seconds" ref={refSeconds}>
        <div className={styleCountDown["time-number"]}>
          <div className={`number-display ${styleCountDown["number-display"]}`}>
            <div className={`number-display__top ${styleCountDown["number-display__top"]}`} ref={refDisplayTopSeconds}>
              <span></span>
            </div>
            <div className={`number-display__bottom ${styleCountDown["number-display__bottom"]}`} ref={refDisplayBottomSeconds}>
              <span></span>
            </div>
          </div>
          <div className={`number-overlay flip ${styleCountDown["number-overlay"]} ${styleCountDown["flip"]}`}>
            <div className={`number-overlay__top ${styleCountDown["number-overlay__top"]}`} ref={refOverlayTopSeconds}><span></span></div>
            <div className={`number-overlay__bottom ${styleCountDown["number-overlay__bottom"]}`} ref={refOverlayBottomSeconds}><span></span></div>
          </div>
        </div>
        <div className={styleCountDown["count-down-text"]}>Seconds</div>
      </div>
    </div>
  );
};

export default Countdown;