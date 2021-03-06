import * as functions from 'firebase-functions'
import { regionFunctions } from '../../helper'
import Stripe from 'stripe'

export const create = regionFunctions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.')
	}
	const STRIPE_API_KEY = functions.config().stripe.api_key
	if (!STRIPE_API_KEY) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires STRIPE_API_KEY.')
	}
	const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-03-02' })
	try {
		const result = await stripe.paymentIntents.create(data)
		return result
	} catch (error) {
		console.error(error)
	}
	return
})

export const retrieve = regionFunctions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.')
	}
	const STRIPE_API_KEY = functions.config().stripe.api_key
	if (!STRIPE_API_KEY) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires STRIPE_API_KEY.')
	}
	const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-03-02' })
	const paymentIntentID = data['paymentIntentID']
	if (!paymentIntentID) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires paymentIntentID in data.')
	}
	try {
		const result = await stripe.paymentIntents.retrieve(paymentIntentID)
		return result
	} catch (error) {
		console.error(error)
	}
	return
})

export const update = regionFunctions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.')
	}
	const STRIPE_API_KEY = functions.config().stripe.api_key
	if (!STRIPE_API_KEY) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires STRIPE_API_KEY.')
	}
	const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-03-02' })
	const paymentIntentID = data['paymentIntentID']
	if (!paymentIntentID) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires paymentIntentID in data.')
	}
	const options = data['options']
	if (!options) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires options in data.')
	}
	try {
		const result = await stripe.paymentIntents.update(paymentIntentID, options)
		return result
	} catch (error) {
		console.error(error)
	}
	return
})

export const confirm = regionFunctions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.')
	}
	const STRIPE_API_KEY = functions.config().stripe.api_key
	if (!STRIPE_API_KEY) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires STRIPE_API_KEY.')
	}
	const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-03-02' })
	const paymentIntentID = data['paymentIntentID']
	if (!paymentIntentID) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires paymentIntentID in data.')
	}
	const options = data['options']
	if (!options) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires options in data.')
	}
	try {
		const result = await stripe.paymentIntents.confirm(paymentIntentID, options)
		return result
	} catch (error) {
		console.error(error)
	}
	return
})


export const capture = regionFunctions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.')
	}
	const STRIPE_API_KEY = functions.config().stripe.api_key
	if (!STRIPE_API_KEY) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires STRIPE_API_KEY.')
	}
	const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-03-02' })
	const paymentIntentID = data['paymentIntentID']
	if (!paymentIntentID) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires paymentIntentID in data.')
	}
	try {
		const result = await stripe.paymentIntents.capture(paymentIntentID)
		return result
	} catch (error) {
		console.error(error)
	}
	return
})

export const cancel = regionFunctions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.')
	}
	const STRIPE_API_KEY = functions.config().stripe.api_key
	if (!STRIPE_API_KEY) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires STRIPE_API_KEY.')
	}
	const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2020-03-02' })
	const paymentIntentID = data['paymentIntentID']
	if (!paymentIntentID) {
		throw new functions.https.HttpsError('invalid-argument', 'The functions requires paymentIntentID in data.')
	}
	try {
		const result = await stripe.paymentIntents.cancel(paymentIntentID)
		return result
	} catch (error) {
		console.error(error)
	}
	return
})
