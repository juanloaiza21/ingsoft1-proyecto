const url = 'http://localhost:3000';
export const ConfigVariables = {
  api: {
    appOn: url,
    user: {
      create: {
        method: 'POST',
        url: `${url}/users/`,
      },
      getAll: {
        method: 'GET',
        url: `${url}/users/`,
      },
      delete: {
        method: 'DELETE',
        url: `${url}/users/`,
      },
      update: {
        method: 'PUT',
        url: `${url}/users/`,
      },
      getOne: {
        method: 'GET',
        url: `${url}/users/`,
      },
    },
    auth: {
      login: {
        method: 'POST',
        url: `${url}/auth/login/`,
      },
      logout: {
        method: 'POST',
        url: `${url}/auth/logout/`,
      },
      checkJWT: {
        method: 'GET',
        url: `${url}/auth/profile/`,
      },
      refreshJWT: {
        method: 'POST',
        url: `${url}/auth/refresh/`,
      },
    },
    payment: {
      generate: {
        method: 'POST',
        url: `${url}/payment/checkout/`,
      },
      paymentMethods: {
        method: 'GET',
        url: `${url}/payment/methods/`,
      },
      getPref: {
        method: 'GET',
        url: `${url}/payment/result-pref/`,
      },
      getPayment: {
        method: 'GET',
        url: `${url}/payment/result-payment/`,
      },
      getBill: {
        method: 'GET',
        url: `${url}/payment/bill/`,
      },
    },
    calification: {
      create: {
        method: 'POST',
        url: `${url}/calification/`,
      },
      getAll: {
        method: 'GET',
        url: `${url}/calification/all/`,
      },
      getProm: {
        method: 'GET',
        url: `${url}/calification/prom/`,
      },
    },
    driver: {
      create: {
        method: 'POST',
        url: `${url}/driver/`,
      },
      getAll: {
        method: 'GET',
        url: `${url}/driver/all`,
      },
      getOne: {
        method: 'GET',
        url: `${url}/driver/`,
      },
      update: {
        method: 'PUT',
        url: `${url}/driver/`,
      },
      getTripsByDriver: {
        method: 'GET',
        url: `${url}/driver/trip/`,
      },
    },
    trip: {
      userCreateTrip: {
        method: 'POST',
        url: `${url}/trip/user-solicitate-trip/`,
      },
      driverAcceptTrip: {
        method: 'POST',
        url: `${url}/trip/accept-trip/`,
      },
      userJoinTrip: {
        method: 'POST',
        url: `${url}/trip/user-accept-trip/`,
      },
      driverCreateTrip: {
        method: 'POST',
        url: `${url}/trip/driver-solicitate-trip/`,
      },
      getAll: {
        method: 'GET',
        url: `${url}/trip/`,
      },
      getAllPassengersPerTrip: {
        method: 'GET',
        url: `${url}/trip/passengers/`,
      },
      getOne: {
        method: 'GET',
        url: `${url}/trip/`,
      },
      update: {
        method: 'PUT',
        url: `${url}/trip/`,
      },
      createTrip: {
        method: 'POST',
        url: `${url}/trip/`,
      },
    },
    historical: {
      tripsUser: {
        method: 'GET',
        url: `${url}/historical/trips-user/`,
      },
      billsUser: {
        method: 'GET',
        url: `${url}/historical/bills/`,
      },
    },
  },
};
