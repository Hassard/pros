import { useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './Tab1.css';

import AuthContext from '../AuthContext';
import { useHistory } from 'react-router';

const Tab1: React.FC = () => {

  const { authValues, logout } = useContext(AuthContext);
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div>{JSON.stringify(authValues.user)}</div>
        <IonButton onClick={async () => {
          await logout();
          history.replace("/login");
        }}
        >Logout</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
