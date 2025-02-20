import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { churchRoutes } from '../modules/church/church.route';
import { codeGeneratorRoutes } from '../modules/codeGenerator/codeGenerator.route';
import { eventRoutes } from '../modules/event/event.route';
import { packagesRoutes } from '../modules/packages/packages.route';
import { subscriptionRoutes } from '../modules/subscription/subscription.route';
import { paymentsRoutes } from '../modules/payments/payments.route';
import { workRoutes } from '../modules/work/work.route';
import { activityRoutes } from '../modules/activity/activity.route';
import { sponsorRoutes } from '../modules/sponsor/sponsor.route';
import { networkRoutes } from '../modules/network/network.route';
import { messagesRoutes } from '../modules/messages/messages.route';
import { bookeventRoutes } from '../modules/bookevent/bookevent.route';
import { prayerrequestRoutes } from '../modules/prayerrequest/prayerrequest.route';
import { privacyRoutes } from '../modules/privacy/privacy.route';
import { aboutRoutes } from '../modules/about/about.route';
import { termsRoutes } from '../modules/terms/terms.route';
import { reviewRoutes } from '../modules/review/review.route';
import { trafficRoutes } from '../modules/traffic/traffic.route';
import { contactRoutes } from '../modules/contact/contact.route';
import { coustomPackageRoutes } from '../modules/coustomPackage/coustomPackage.route';
import { imageUploadRoutes } from '../modules/imageUpload/imageUpload.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/churches',
    route: churchRoutes,
  },
  {
    path: '/codeGenerator',
    route: codeGeneratorRoutes,
  },
  {
    path: '/events',
    route: eventRoutes,
  },
  {
    path: '/package',
    route: packagesRoutes,
  },
  {
    path: '/subscriptions',
    route: subscriptionRoutes,
  },
  {
    path: '/payments',
    route: paymentsRoutes,
  },
  {
    path: '/work',
    route: workRoutes,
  },
  {
    path: '/activities',
    route: activityRoutes,
  },
  {
    path: '/sponsor',
    route: sponsorRoutes,
  },
  {
    path: '/network',
    route: networkRoutes,
  },
  {
    path: '/messages',
    route: messagesRoutes,
  },
  {
    path: '/bookevents',
    route: bookeventRoutes,
  },
  {
    path: '/prayerrequests',
    route: prayerrequestRoutes,
  },
  {
    path: '/privacy',
    route: privacyRoutes,
  },
  {
    path: '/about',
    route: aboutRoutes,
  },
  {
    path: '/terms',
    route: termsRoutes,
  },
  {
    path: '/review',
    route: reviewRoutes,
  },
  {
    path: '/traffic',
    route: trafficRoutes,
  },
  {
    path: '/contact',
    route: contactRoutes,
  },
  {
    path: '/custompackage',
    route: coustomPackageRoutes,
  },
  {
    path: '/imageUpload',
    route: imageUploadRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
