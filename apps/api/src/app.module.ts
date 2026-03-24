import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ProjectsModule } from './projects/projects.module';
import { TimesheetsModule } from './timesheets/timesheets.module';
import { LeavesModule } from './leaves/leaves.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [DbModule, AuthModule, UsersModule, RolesModule, ProjectsModule, TimesheetsModule, LeavesModule, CalendarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
