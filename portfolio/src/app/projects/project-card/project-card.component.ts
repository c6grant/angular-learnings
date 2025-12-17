import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  @Input() project!: Project;
}
