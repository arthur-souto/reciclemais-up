export interface PrizeRedemption {
  id: number | null
  fk_prize: number
  fk_user: string
  redeemed_at: string
}
