import { Text, StyleSheet} from 'react-native';

function Title({children}) {
    return (
        <Text style={styles.titleComponent}>
            {children}
        </Text>
    );
}

export default Title;

const styles = StyleSheet.create({
    titleComponent: {
        color: '#FFE6E6',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
    }
});
