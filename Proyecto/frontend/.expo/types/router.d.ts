/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams:
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/agreedTrips`; params?: Router.UnknownInputParams }
        | { pathname: `/BottomNavBar`; params?: Router.UnknownInputParams }
        | { pathname: `/chat`; params?: Router.UnknownInputParams }
        | { pathname: `/currentTrip`; params?: Router.UnknownInputParams }
        | { pathname: `/historial`; params?: Router.UnknownInputParams }
        | { pathname: `/home`; params?: Router.UnknownInputParams }
        | { pathname: `/indexx`; params?: Router.UnknownInputParams }
        | { pathname: `/newTrip`; params?: Router.UnknownInputParams }
        | { pathname: `/preferences`; params?: Router.UnknownInputParams }
        | { pathname: `/profile`; params?: Router.UnknownInputParams }
        | { pathname: `/publishTravel`; params?: Router.UnknownInputParams }
        | { pathname: `/register`; params?: Router.UnknownInputParams }
        | { pathname: `/settings`; params?: Router.UnknownInputParams }
        | { pathname: `/solicitudViaje`; params?: Router.UnknownInputParams }
        | { pathname: `/styles`; params?: Router.UnknownInputParams }
        | { pathname: `/userProfile`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `/components/appearanceModal`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/components/notificationsModal`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/components/travelPreferencesModal`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/config/config`; params?: Router.UnknownInputParams }
        | {
            pathname: `/context/themeContext`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/enums/bill.enum`; params?: Router.UnknownInputParams }
        | {
            pathname: `/enums/payment.enum`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/enums/role.enum`; params?: Router.UnknownInputParams }
        | { pathname: `/enums/trip.enum`; params?: Router.UnknownInputParams }
        | {
            pathname: `/types/api-response.type`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/types/driver.types`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/types/trip.types`; params?: Router.UnknownInputParams }
        | { pathname: `/types/user.types`; params?: Router.UnknownInputParams };
      hrefOutputParams:
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/agreedTrips`; params?: Router.UnknownOutputParams }
        | { pathname: `/BottomNavBar`; params?: Router.UnknownOutputParams }
        | { pathname: `/chat`; params?: Router.UnknownOutputParams }
        | { pathname: `/currentTrip`; params?: Router.UnknownOutputParams }
        | { pathname: `/historial`; params?: Router.UnknownOutputParams }
        | { pathname: `/home`; params?: Router.UnknownOutputParams }
        | { pathname: `/indexx`; params?: Router.UnknownOutputParams }
        | { pathname: `/newTrip`; params?: Router.UnknownOutputParams }
        | { pathname: `/preferences`; params?: Router.UnknownOutputParams }
        | { pathname: `/profile`; params?: Router.UnknownOutputParams }
        | { pathname: `/publishTravel`; params?: Router.UnknownOutputParams }
        | { pathname: `/register`; params?: Router.UnknownOutputParams }
        | { pathname: `/settings`; params?: Router.UnknownOutputParams }
        | { pathname: `/solicitudViaje`; params?: Router.UnknownOutputParams }
        | { pathname: `/styles`; params?: Router.UnknownOutputParams }
        | { pathname: `/userProfile`; params?: Router.UnknownOutputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/components/appearanceModal`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `/components/notificationsModal`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `/components/travelPreferencesModal`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/config/config`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/context/themeContext`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/enums/bill.enum`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/enums/payment.enum`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/enums/role.enum`; params?: Router.UnknownOutputParams }
        | { pathname: `/enums/trip.enum`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/types/api-response.type`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `/types/driver.types`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/types/trip.types`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/types/user.types`;
            params?: Router.UnknownOutputParams;
          };
      href:
        | Router.RelativePathString
        | Router.ExternalPathString
        | `/agreedTrips${`?${string}` | `#${string}` | ''}`
        | `/BottomNavBar${`?${string}` | `#${string}` | ''}`
        | `/chat${`?${string}` | `#${string}` | ''}`
        | `/currentTrip${`?${string}` | `#${string}` | ''}`
        | `/historial${`?${string}` | `#${string}` | ''}`
        | `/home${`?${string}` | `#${string}` | ''}`
        | `/indexx${`?${string}` | `#${string}` | ''}`
        | `/newTrip${`?${string}` | `#${string}` | ''}`
        | `/preferences${`?${string}` | `#${string}` | ''}`
        | `/profile${`?${string}` | `#${string}` | ''}`
        | `/publishTravel${`?${string}` | `#${string}` | ''}`
        | `/register${`?${string}` | `#${string}` | ''}`
        | `/settings${`?${string}` | `#${string}` | ''}`
        | `/solicitudViaje${`?${string}` | `#${string}` | ''}`
        | `/styles${`?${string}` | `#${string}` | ''}`
        | `/userProfile${`?${string}` | `#${string}` | ''}`
        | `/_sitemap${`?${string}` | `#${string}` | ''}`
        | `/components/appearanceModal${`?${string}` | `#${string}` | ''}`
        | `/components/notificationsModal${`?${string}` | `#${string}` | ''}`
        | `/components/travelPreferencesModal${
            | `?${string}`
            | `#${string}`
            | ''}`
        | `/config/config${`?${string}` | `#${string}` | ''}`
        | `/context/themeContext${`?${string}` | `#${string}` | ''}`
        | `/enums/bill.enum${`?${string}` | `#${string}` | ''}`
        | `/enums/payment.enum${`?${string}` | `#${string}` | ''}`
        | `/enums/role.enum${`?${string}` | `#${string}` | ''}`
        | `/enums/trip.enum${`?${string}` | `#${string}` | ''}`
        | `/types/api-response.type${`?${string}` | `#${string}` | ''}`
        | `/types/driver.types${`?${string}` | `#${string}` | ''}`
        | `/types/trip.types${`?${string}` | `#${string}` | ''}`
        | `/types/user.types${`?${string}` | `#${string}` | ''}`
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/agreedTrips`; params?: Router.UnknownInputParams }
        | { pathname: `/BottomNavBar`; params?: Router.UnknownInputParams }
        | { pathname: `/chat`; params?: Router.UnknownInputParams }
        | { pathname: `/currentTrip`; params?: Router.UnknownInputParams }
        | { pathname: `/historial`; params?: Router.UnknownInputParams }
        | { pathname: `/home`; params?: Router.UnknownInputParams }
        | { pathname: `/indexx`; params?: Router.UnknownInputParams }
        | { pathname: `/newTrip`; params?: Router.UnknownInputParams }
        | { pathname: `/preferences`; params?: Router.UnknownInputParams }
        | { pathname: `/profile`; params?: Router.UnknownInputParams }
        | { pathname: `/publishTravel`; params?: Router.UnknownInputParams }
        | { pathname: `/register`; params?: Router.UnknownInputParams }
        | { pathname: `/settings`; params?: Router.UnknownInputParams }
        | { pathname: `/solicitudViaje`; params?: Router.UnknownInputParams }
        | { pathname: `/styles`; params?: Router.UnknownInputParams }
        | { pathname: `/userProfile`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `/components/appearanceModal`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/components/notificationsModal`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/components/travelPreferencesModal`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/config/config`; params?: Router.UnknownInputParams }
        | {
            pathname: `/context/themeContext`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/enums/bill.enum`; params?: Router.UnknownInputParams }
        | {
            pathname: `/enums/payment.enum`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/enums/role.enum`; params?: Router.UnknownInputParams }
        | { pathname: `/enums/trip.enum`; params?: Router.UnknownInputParams }
        | {
            pathname: `/types/api-response.type`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/types/driver.types`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/types/trip.types`; params?: Router.UnknownInputParams }
        | { pathname: `/types/user.types`; params?: Router.UnknownInputParams };
    }
  }
}
