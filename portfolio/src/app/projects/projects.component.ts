import { Component } from '@angular/core';
import { projects } from './projects';
import { ProjectCardComponent } from './project-card/project-card.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCardComponent, RouterOutlet],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  projects = projects;
}
