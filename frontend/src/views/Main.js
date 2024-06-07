/* eslint-disable */

import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import {Header, Panel} from '@enact/sandstone/Panels';
import $L from '@enact/i18n/$L';
import Home from './Home';
import Video from './Video';
import Account from './Account';
import HLSVideo from './HLSVideo';
import MyVideos from './MyVideos';
import MyPage  from './MyPage';
import css from './Main.module.less';


const Main = (props) => {
	return (
		<Panel {...props} style={{
			backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
			height: '100vh', // Ensure the panel takes up the full viewport height
			width: '100vw' // Ensure the panel takes up the full viewport width
		  }}
		  >
			<TabLayout orientation='horizontal'>
				<Tab title={$L('Home')}>
					<Home />
				</Tab>
				<Tab title={$L('My Videos')}>
					<MyVideos />
				</Tab>
				<Tab title={$L('Video Player')}>
					<Video src="http://media.w3.org/2010/05/sintel/trailer.mp4" />
				</Tab>
				<Tab title={$L('My Page')}>
					<MyPage />
				</Tab>
			</TabLayout>
		</Panel>
	);
};
export default Main;


//<Header title={$L('Enact Template')} />
//<Tab title={$L('HLS Video Player')}>
//<HLSVideo src="https://cdn-vos-ppp-01.vos360.video/Content/HLS_HLSCLEAR/Live/channel(PPP-LL-2HLS)/index.m3u8" />
//</Tab>
//<Tab title={$L('Account')}>
//<Account />
//</Tab>