import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
// firebase
import firestore from '@react-native-firebase/firestore';
import {LoadingScreen} from '../components/LoadingScreen';
import {ShowSnackBar} from '../utils/Constants';
const Home = ({navigation, route}) => {
  const paperTheme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  function fetchCompanies() {
    setIsLoading(true);
    firestore()
      .collection('available')
      .get()
      .then(querySnapshot => {
        console.log('Total Companies: ', querySnapshot.size);

        let data = [];
        querySnapshot.forEach(documentSnapshot => {
          console.log(
            'User ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );
          data.push(documentSnapshot.data());
        });
        setCompanies(data);
      })
      .catch(e => {
        ShowSnackBar('error', e.message);
      });
    setIsLoading(false);
  }
  useEffect(() => {
    // trigger on change
    fetchCompanies();
  }, []);
  return isLoading ? (
    <LoadingScreen msg="Loading data.." isAutomatic={true} />
  ) : (
    <View style={styles.container}>
      <ScrollView>
        {companies.length != 0 ? (
          companies.map(company => (
            <View
              key={company.icid}
              style={{
                backgroundColor: paperTheme.colors.foregroundColor,
                marginBottom: 5,
                padding: 10,
                margin: 10,
                borderRadius: 5,
                elevation: 5,
              }}>
              <Text style={styles.heading}>{company.name}</Text>
              <Text style={styles.subHeading}>Rs.{company.price}</Text>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('StepOne', {company})}
                  style={{
                    elevation: 3,
                    padding: 10,
                    backgroundColor: paperTheme.colors.accent,
                    borderRadius: 5,
                  }}>
                  <Text>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Image />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},

  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default Home;
