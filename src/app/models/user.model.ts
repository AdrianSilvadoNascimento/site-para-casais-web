export class UserModel {
  id!: string
  name!: string
  email!: string
  password!: string
  age!: number
  affection_message!: string
  spouse_name!: string
  couple_image?: string
  photo_liked!: boolean
  couple_start!: Date
  createdAt!: Date
  updatedAt!: Date
}
