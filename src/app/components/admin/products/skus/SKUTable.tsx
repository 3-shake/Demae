
import React, { useState } from 'react'
import firebase from 'firebase'
import Link from 'next/link'
import { File as StorageFile } from '@1amageek/ballcap'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import DndCard from 'components/DndCard'
import Box from '@material-ui/core/Box';
import Input, { useInput } from 'components/Input'
import Select, { useSelect } from 'components/Select'
import { SKU } from 'models/commerce';
import { Currencies } from 'common/Currency'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		box: {
			backgroundColor: '#fafafa'
		},
		bottomBox: {
			padding: theme.spacing(1),
			display: 'flex',
			justifyContent: 'flex-end'
		},
		input: {
			backgroundColor: '#fff'
		},
		cell: {
			borderBottom: 'none',
			padding: theme.spacing(1),
		},
		cellStatus: {
			borderBottom: 'none',
			padding: theme.spacing(1),
			width: '48px',
		},
		cellStatusBox: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		}
	})
);

export default ({ edit, sku }: { edit: boolean, sku: SKU }) => {
	const classes = useStyles()
	const [isLoading, setLoading] = useState(false)
	const [images, setImages] = useState<File[]>([])
	const [isEditing, setEditing] = useState(edit)
	const name = useInput(sku?.name)
	const caption = useInput(sku?.caption)
	const amount = useInput(sku?.amount)
	const description = useInput(sku?.description)
	const currency = useSelect({
		initValue: sku?.currency, inputProps: {
			menu: Currencies.map(c => {
				return {
					label: c,
					value: c,
				}
			})
		}
	})
	const inventory = useSelect({
		initValue: sku?.inventory.type, inputProps: {
			menu: [
				{
					label: 'Bucket',
					value: 'bucket'
				},
				{
					label: 'Finite',
					value: 'finite'
				}
				, {
					label: 'Infinite',
					value: 'infinite'
				}
			]
		}
	})
	const stockValue = useSelect({
		initValue: sku?.inventory.value, inputProps: {
			menu: [
				{
					label: 'InStock',
					value: 'in_stock'
				},
				{
					label: 'Limited',
					value: 'limited'
				}
				, {
					label: 'OutOfStock',
					value: 'out_of_stock'
				}
			]
		}
	})
	const isAvailable = useSelect({
		initValue: sku?.isAvailable || 'true',
		inputProps: {
			menu: [
				{
					label: 'Available',
					value: 'true'
				},
				{
					label: 'Unavailable',
					value: 'false'
				}
			]
		}
	})

	const uploadImages = (files: File[]) => {
		return files.map(file => {
			return uploadImage(file)
		})
	}

	const uploadImage = (file: File): Promise<StorageFile | undefined> => {
		const id = firebase.firestore().collection('/dummy').doc().id
		const ref = firebase.storage().ref(sku.documentReference.path + `/images/${id}.jpg`)
		return new Promise((resolve, reject) => {
			ref.put(file).then(async (snapshot) => {
				if (snapshot.state === 'success') {
					const storageFile = new StorageFile()
					if (snapshot.metadata.contentType) {
						storageFile.mimeType = snapshot.metadata.contentType
					}
					storageFile.path = ref.fullPath
					resolve(storageFile)
				} else {
					reject(undefined)
				}
			})
		})
	}

	if (isEditing) {
		return (
			<>
				<AppBar position='static' color='transparent' elevation={0}>
					<Toolbar>
						<Typography variant='h6'>
							Edit Product
          	</Typography>
					</Toolbar>
				</AppBar>
				<Box className={classes.box} >
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<DndCard
								defaultText={'Images Image Drop the files here ...'}
								onDrop={(files) => {
									setImages(files)
								}} />
						</Grid>
					</Grid>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell align='right'><div>ID</div></TableCell>
								<TableCell align='left'><div>{sku.id}</div></TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>name</div></TableCell>
								<TableCell align='left'>
									<div>
										<Input variant='outlined' margin='dense' {...name} />
									</div>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>caption</div></TableCell>
								<TableCell align='left'>
									<div>
										<Input variant='outlined' margin='dense' {...caption} />
									</div>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>description</div></TableCell>
								<TableCell align='left'>
									<div>
										<Input variant='outlined' margin='dense' {...description} />
									</div>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>amount</div></TableCell>
								<TableCell align='left'>
									<div>
										<Select {...currency} />
										<Input variant='outlined' margin='dense' {...amount} />
									</div>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>inventory</div></TableCell>
								<TableCell align='left'>
									<div>
										<Select {...inventory} />
									</div>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>Status</div></TableCell>
								<TableCell align='left'>
									<div>
										<Select fullWidth {...isAvailable} />
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Box>
				<Box className={classes.bottomBox} >
					<Toolbar>
						<Grid container spacing={2} alignItems='center'>
							<Grid item>
								<Button variant='outlined' onClick={() => {
									setEditing(false)
								}}>CANCEL</Button>
							</Grid>
							<Grid item>
								<Button variant='contained' color='primary' onClick={async () => {
									setLoading(true)
									const uploadedImages = await Promise.all(uploadImages(images))
									if (uploadedImages) {
										const fileterd = uploadedImages.filter(image => !!image) as StorageFile[]
										sku.images = fileterd
									}
									sku.name = name.value
									sku.caption = caption.value
									sku.description = description.value
									sku.isAvailable = isAvailable.value === 'true'
									await sku.save()
									setEditing(false)
									setLoading(false)
								}}>SAVE</Button>
							</Grid>
						</Grid>
					</Toolbar>
				</Box>
			</>
		)
	} else {
		return (
			<>
				<AppBar position='static' color='transparent' elevation={0}>
					<Toolbar>
						<Grid container spacing={2} alignItems='center'>
							<Grid item>
								<Link href='/admin/products'>
									<Tooltip title='Back'>
										<IconButton>
											<ArrowBackIcon color='inherit' />
										</IconButton>
									</Tooltip>
								</Link>
							</Grid>
							<Grid item>
								<Typography variant='h6'>
									Product
          			</Typography>
							</Grid>
						</Grid>
					</Toolbar>
				</AppBar>
				<Box className={classes.box} >
					<Table>
						<TableBody>
							<TableRow>
								<TableCell align='right'><div>ID</div></TableCell>
								<TableCell align='left'><div>{sku.id}</div></TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>name</div></TableCell>
								<TableCell align='left'><div>{sku.name}</div></TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>caption</div></TableCell>
								<TableCell align='left'><div>{sku.caption}</div></TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>description</div></TableCell>
								<TableCell align='left'><div>{sku.description}</div></TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>amount</div></TableCell>
								<TableCell align='left'><div>{sku.amount}</div></TableCell>
							</TableRow>
							<TableRow>
								<TableCell align='right'><div>Status</div></TableCell>
								<TableCell align='left'><div>{sku.isAvailable ? 'Available' : 'Disabled'}</div></TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Box>
				<Box className={classes.bottomBox} >
					<Toolbar>
						<Button variant='contained' color='primary' onClick={() => {
							setEditing(true)
						}}>EDIT</Button>
					</Toolbar>
				</Box>
			</>
		)
	}
}
