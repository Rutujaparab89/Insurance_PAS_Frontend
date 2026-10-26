
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-placeholder',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-placeholder.html'
})
export class DashboardPlaceholder {

  constructor(private route: ActivatedRoute) {}

  get pageTitle(): string {
    return this.route.snapshot.data['title'] ?? 'Module Page';
  }

  get dashboardPath(): string {
    const segments = this.route.snapshot.pathFromRoot
      .flatMap(route => route.url.map(segment => segment.path));

    const role = segments[0] ?? 'customer';
    return `/${role}/dashboard`;
  }
}
