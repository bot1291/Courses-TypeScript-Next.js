import styles from './Menu.module.css';
import cn from 'classnames';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/app.context';
import { FirstLevelMenuItem, PageItem } from '../../interfaces/menu.interface';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { firstLevelMenu } from '../../helpers/helpers';

export const Menu = () => {
	const { menuDefault, firstCategory, menu, setMenu } =
		useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		if (menuDefault && setMenu) {
			setMenu(menuDefault);
		}
	}, [setMenu, menuDefault]);

	const openSecondLevel = (secondCategory: string) => {
		setMenu &&
			setMenu(
				menu.map((m) => {
					if (m._id.secondCategory === secondCategory) {
						m.isOpened = !m.isOpened;
					}
					return m;
				})
			);
	};

	const buildFirstLevel = () => {
		return (
			<>
				{firstLevelMenu.map((m) => (
					<div key={m.route}>
						<Link href={`/${m.route}`} legacyBehavior>
							<a>
								<div
									className={cn(styles.firstLevel, {
										[styles.firstLevelActive]:
											m.id === firstCategory,
									})}
								>
									{m.icon}
									<span>{m.name}</span>
								</div>
							</a>
						</Link>
						{m.id === firstCategory && buildSecondLevel(m)}
					</div>
				))}
			</>
		);
	};

	const buildSecondLevel = (menuItem: FirstLevelMenuItem) => {
		return (
			<div className={styles.secondBlock}>
				{menu &&
					menu.map((m) => {
						if (
							m.pages
								.map((p) => p.alias)
								.includes(router.asPath.split('/')[2])
						) {
							m.isOpened = true;
						}
						return (
							<div key={m._id.secondCategory}>
								<div
									onClick={() =>
										openSecondLevel(m._id.secondCategory)
									}
									className={styles.secondLevel}
								>
									{m._id.secondCategory}
								</div>
								<div
									className={cn(styles.secondLevelBlock, {
										[styles.secondLevelBlockOpened]:
											m.isOpened,
									})}
								>
									{buildThirdLevel(m.pages, menuItem.route)}
								</div>
							</div>
						);
					})}
			</div>
		);
	};

	const buildThirdLevel = (pages: PageItem[], route: string) => {
		return pages.map((p) => {
			return (
				<Link
					key={p.alias}
					href={`/${route}/${p.alias}`}
					legacyBehavior
				>
					<a
						href={`/${route}/${p.alias}`}
						className={cn(styles.thirdLevel, {
							[styles.thirdLevelActive]:
								`/${route}/${p.alias}` === router.asPath,
						})}
					>
						{p.category}
					</a>
				</Link>
			);
		});
	};

	return <div className={styles.menu}>{buildFirstLevel()}</div>;
};
