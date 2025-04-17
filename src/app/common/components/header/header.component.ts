import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { differenceInSeconds, format, isWithinInterval, set } from 'date-fns';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  clock = signal<Date>(new Date());
  clockEvent: NodeJS.Timeout | undefined = undefined;

  clockDateTime = computed<string>(() =>
    format(this.clock(), 'dd/MM/yyyy hh:mm:ss aa')
  );

  usageCycle = computed<string>(() => {
    const today10PM = set(this.clock(), {
      hours: 22,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const today7AM = set(this.clock(), {
      hours: 7,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const today9AM = set(this.clock(), {
      hours: 9,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const today5PM = set(this.clock(), {
      hours: 17,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const today8PM = set(this.clock(), {
      hours: 20,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    if (
      differenceInSeconds(this.clock(), today10PM) >= 0 ||
      differenceInSeconds(this.clock(), today7AM) <= 0
    ) {
      return 'Off-peak hours';
    } else if (
      isWithinInterval(this.clock(), {
        start: today7AM,
        end: today9AM,
      }) ||
      isWithinInterval(this.clock(), {
        start: today5PM,
        end: today8PM,
      })
    ) {
      return 'Peak hours';
    } else {
      return 'Shoulder hours';
    }
  });

  ngOnInit(): void {
    this.clockEvent = setInterval(() => {
      this.getCurrentClock();
    }, 1000);
  }

  /**
   * Get current clock
   */
  getCurrentClock() {
    this.clock.update(() => new Date());
  }

  ngOnDestroy(): void {
    clearInterval(this.clockEvent);
  }
}
