import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MediaStream, RTCView } from 'react-native-webrtc';
import Button from './Button';

interface Props {
    hangup: () => void;
    localStream?: MediaStream | null;
    remoteStream?: MediaStream | null;
}

function ButtonContainer(props: Props) {
    return <View style={styles.bcontainer}>
        <Button iconName='phone' backgroundColor='red' onPress={props.hangup} />
    </View>;
}

export default function Video(props: Props) {
    //on Call bech n3adiw local stream mtaa l caller 9bal mayhez wala y3alle9 l calle
    if (props.localStream && !props.remoteStream) {
        return (
            <View style={styles.container}>
                <RTCView
                    streamURL={props.localStream.toURL()}
                    objectFit={'cover'}
                    style={styles.video}
                />
                <ButtonContainer hangup={props.hangup} />
            </View>
        );
    }
    //wa9t l callee yhez n3adiw local w remote
    if (props.localStream && props.remoteStream) {
        return (
            <View style={styles.container}>
                <RTCView
                    streamURL={props.remoteStream.toURL()}
                    objectFit={'cover'}
                    style={styles.video}
                />
                <RTCView
                    streamURL={props.localStream.toURL()}
                    objectFit={'cover'}
                    style={styles.Localvideo}
                />
                <ButtonContainer hangup={props.hangup} />
            </View>
        );
    }
    return <ButtonContainer hangup={props.hangup} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    video: {
        position: 'absolute',
        width: '100%',
        height: '100%',

    },
    Localvideo: {
        position: 'absolute',
        width: '100',
        height: '150',
        top : 0,
        left : 20,
        elevation:10,

    },
    bcontainer: {
        flexDirection: 'row',
        bottom: 30,
    }
});