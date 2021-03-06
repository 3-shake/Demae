import React from 'react';
import { useRouter } from 'next/router'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Card from 'components/providers/products/Card'
import { useDocument, useDataSource } from 'hooks/commerce';
import { Provider, Product } from 'models/commerce';
import DataLoading from 'components/DataLoading';
import SKUList from './skus/SKUList';

export default ({ providerID, productID }: { providerID: string, productID: string }) => {
	const [data, isLoading] = useDocument<Product>(Product, new Provider(providerID).products.collectionReference.doc(productID))

	if (isLoading) {
		return <DataLoading />
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} container>
				<Card providerID={providerID} product={data!} />
			</Grid>
			<Grid item xs={12} container>
				<SKUList providerID={providerID} productID={productID} />
			</Grid>
		</Grid>
	)
}
