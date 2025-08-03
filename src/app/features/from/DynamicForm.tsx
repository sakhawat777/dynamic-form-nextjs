'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema with file validation
const schema = z.object({
	items: z.array(
		z.object({
			tin: z.string().min(1, 'Tin/Bin is required'),
			file: z
				.any()
				.refine(
					(file) => file instanceof File || (file && file.length > 0),
					'File is required'
				),
		})
	),
});

type FormData = z.infer<typeof schema>;

const DynamicForm = () => {
	const [items, setItems] = useState([{ tin: '', file: null }]);

	const {
		control,
		handleSubmit,
		setValue,
		register,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { items },
	});

	const onSubmit = (data: FormData) => {
		// Log file names to verify
		const withFileNames = data.items.map((item) => ({
			tin: item.tin,
			fileName: item.file?.name,
		}));
		console.log('Submitted data:', withFileNames);
	};

	const handleAdd = () => {
		const newItems = [...items, { tin: '', file: null }];
		setItems(newItems);
		setValue('items', newItems);
	};

	const handleRemove = (index: number) => {
		const newItems = items.filter((_, i) => i !== index);
		setItems(newItems);
		setValue('items', newItems);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='p-4 space-y-4'>
			{items.map((_, index) => (
				<div key={index} className='space-y-4 border p-4 rounded'>
					{/* Tin/Bin input */}
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Tin/Bin
						</label>
						<Controller
							name={`items.${index}.tin`}
							control={control}
							render={({ field }) => (
								<input
									{...field}
									className='block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								/>
							)}
						/>
						{errors.items?.[index]?.tin && (
							<p className='mt-2 text-sm text-red-600'>
								{errors.items[index].tin?.message}
							</p>
						)}
					</div>

					{/* File input */}
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Filepath
						</label>
						<Controller
							name={`items.${index}.file`}
							control={control}
							render={({ field }) => (
								<input
									type='file'
									onChange={(e) => {
										const file = e.target.files?.[0] ?? null;
										field.onChange(file);
									}}
									className='block w-full mt-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100'
								/>
							)}
						/>
						{errors.items?.[index]?.file && (
							<p className='mt-2 text-sm text-red-600'>
								{typeof errors.items[index].file?.message === 'string'
									? errors.items[index].file?.message
									: null}
							</p>
						)}
					</div>

					<button
						type='button'
						onClick={() => handleRemove(index)}
						className='mt-2 text-sm text-red-600 hover:underline'>
						Delete
					</button>
				</div>
			))}

			{/* Add Item Button */}
			<button
				type='button'
				onClick={handleAdd}
				className='mt-4 p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700'>
				Add Item
			</button>

			{/* Submit Button */}
			<button
				type='submit'
				className='ml-4 p-2 text-white bg-green-500 rounded-md hover:bg-green-600'>
				Submit
			</button>
		</form>
	);
};

export default DynamicForm;
