import { httpClient } from '../api/httpClient'

function toQS(params) {
  const p = {}
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p[k] = v
  })
  return new URLSearchParams(p).toString()
}

export const donationService = {
  getDonations:     (params, { signal } = {}) => httpClient.get(`/donations?${toQS(params)}`, signal),
  getDonationTiers: (        { signal } = {}) => httpClient.get('/donation-tiers', signal),
  createDonation:   (data)                    => httpClient.post('/donations', data),
  confirmDonation:  (id, paymentRef)          => httpClient.post(`/donations/${id}/confirm`, { payment_ref: paymentRef }),
  rejectDonation:   (id, reason)              => httpClient.post(`/donations/${id}/reject`, { reason }),
}
