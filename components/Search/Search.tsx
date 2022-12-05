import { SearchProps } from './Search.props';
import styles from './Search.module.css';
import cn from 'classnames';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import LoopIcon from './loop.svg';
import { KeyboardEvent, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '../../context/app.context';
import { PageItem } from '../../interfaces/menu.interface';

export const Search = ({ className, ...props }: SearchProps) => {
	const [search, setSearch] = useState<string>('');
	const router = useRouter();

	const { menu, handleSetSearchPages } = useContext(AppContext);


	const goToSearch = () => {
		const newPages: PageItem[] = [];
		for (let i = 0; i < menu.length; i++) {
			for (let e = 0; e < menu[i].pages.length; e++) {
				if (
					menu[i].pages[e].alias
						.toLocaleLowerCase()
						.split(' ')
						.join('')
						.includes(
							search.toLocaleLowerCase().split(' ').join('')
						) ||
					menu[i].pages[e].category
						.toLocaleLowerCase()
						.split(' ')
						.join('')
						.includes(
							search.toLocaleLowerCase().split(' ').join('')
						)
				) {
					newPages.push(menu[i].pages[e]);
				}
			}
		}
		localStorage.pages = JSON.stringify(newPages);
		handleSetSearchPages && handleSetSearchPages();
		router.push({
			pathname: '/search',
			query: {
				q: search,
			},
		});
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			goToSearch();
		}
	};

	return (
		<div {...props} className={cn(className, styles.search)}>
			<Input
				className={styles.input}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Поиск..."
				onKeyDown={handleKeyDown}
			/>
			<Button className={styles.button} onClick={goToSearch}>
				<LoopIcon />
			</Button>
		</div>
	);
};
