import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const HomeDialog = ({ open, handleClose, handleSubmit, title, children }) => {
	return (
		<Dialog
			open={open}
			fullWidth
			maxWidth="xs"
			onClose={handleClose}
			slotProps={{
				paper: {
					component: 'form',
					onSubmit: handleSubmit,
					noValidate: true,
					autoComplete: 'off'
				}
			}}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>{children}</DialogContent>
		</Dialog>
	);
};

export default HomeDialog;
