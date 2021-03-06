import React, { useEffect, useState } from 'react'
import NextApp, { AppProps, AppContext } from "next/app"
import { StaticRouter, BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom'
import * as Ballcap from "@1amageek/ballcap"
import firebase from "firebase"
import "@firebase/firestore"
import "@firebase/auth"
import * as Social from 'models/social'
import { UserProvider } from 'context'

const config = require(`../config/${process.env.FIREBASE_CONFIG!}`)
const isEmulated = process.env.EMULATE_ENV === "emulator"

if (firebase.apps.length === 0) {
	const app = firebase.initializeApp(config)
	const firestore = app.firestore()
	if (isEmulated) {
		console.log("[APP] run emulator...")
		firestore.settings({
			host: "localhost:8080",
			ssl: false
		});
	}
	Ballcap.initialize(app)
}

interface Props {
	authUser: firebase.User | null
}

const Provider = ({ children }: { children: any }) => {
	return (
		<UserProvider>
			{children}
		</UserProvider>
	)
}

const Router = ({ children }: { children: any }) => {
	if (process.browser) {
		return (
			<BrowserRouter>
				{children}
			</BrowserRouter>
		)
	} else {
		return (
			<StaticRouter>
				{children}
			</StaticRouter>
		)
	}
}

const App = ({ Component, pageProps, router }: AppProps) => {

	const [state, setState] = useState<Props>({ authUser: null })

	useEffect(() => {
		console.log('[App] start auth listening')
		const listener = firebase.auth().onAuthStateChanged(async (auth) => {
			if (auth) {
				console.log('auth id: ', auth.uid)
				const authUser = JSON.stringify(auth)
				localStorage.setItem('authUser', authUser)
				setState({
					authUser: auth
				})
			} else {
				localStorage.removeItem('authUser')
				setState({
					authUser: null
				})
			}
		})
		return () => {
			listener()
		}
	}, [state.authUser?.uid])

	useEffect(() => {
		console.log('[App] start Token listening')
		const listener = firebase.auth().onIdTokenChanged(async (auth) => {
			if (auth) {
				const result = await auth.getIdTokenResult()
				const claims = JSON.stringify(result.claims)
				localStorage.setItem('claims', claims)
			} else {
				localStorage.removeItem('claims')
			}
		})
		return () => {
			listener()
		}
	}, [])

	return (
		<Provider>
			<Router>
				<Component {...pageProps} />
			</Router >
		</Provider>
	)
}

App.getInitialProps = async (context: AppContext) => {
	// const { ctx: { query, asPath, req, res }, Component } = context;
	const appProps = await NextApp.getInitialProps(context);
	return { ...appProps };
}

export default App
