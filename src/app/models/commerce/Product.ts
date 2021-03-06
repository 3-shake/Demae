import { Doc, Field, Collection, SubCollection, firestore, CollectionReference, File } from '@1amageek/ballcap'
import Plan from './Plan'
import SKU from './SKU'

export type ProductType = 'service' | 'good'

export default class Product extends Doc {

	static collectionReference(): CollectionReference {
		return firestore.collection('commerce/v1/products')
	}

	@Field images: File[] = []
	@Field type: ProductType = 'good'
	@Field name: string = ''
	@Field caption?: string
	@Field description?: string
	@Field isAvailable: boolean = true
	@Field metadata?: any
	@SubCollection skus: Collection<SKU> = new Collection()
	@SubCollection plans: Collection<Plan> = new Collection()

	imageURLs() {
		return this.images.map(image => {
			if (image) {
				return `https://demae-210ed.firebaseapp.com//assets/${image.path}`
			}
			return undefined
		}).filter(value => !!value)
	}
}
