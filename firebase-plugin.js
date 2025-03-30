const {
    withPlugins,
    withAndroidManifest,
    withAppBuildGradle,
    withProjectBuildGradle,
    withInfoPlist,
  } = require("@expo/config-plugins");
  
  // Fonction pour ajouter google-services au build.gradle de l’app
  const withFirebaseAndroid = (config) => {
    return withAppBuildGradle(config, (config) => {
      config.modResults.contents += "\napply plugin: 'com.google.gms.google-services'\n";
      return config;
    });
  };
  
  // Fonction pour ajouter le classpath Google Services au build.gradle du projet
  const withFirebaseProjectGradle = (config) => {
    return withProjectBuildGradle(config, (config) => {
      config.modResults.contents = config.modResults.contents.replace(
        /dependencies\s*{/,
        `dependencies {
          classpath 'com.google.gms:google-services:4.4.2'`
      );
      return config;
    });
  };
  
  // Fonction pour ajouter GoogleServicesFile à AndroidManifest
  const withFirebaseManifest = (config) => {
    return withAndroidManifest(config, (config) => {
      return config;
    });
  };
  
  // Fonction pour ajouter GoogleService-Info.plist à iOS
  const withFirebaseIOS = (config) => {
    return withInfoPlist(config, (config) => {
      config.modResults.GoogleServicesFile = "GoogleService-Info.plist";
      return config;
    });
  };
  
  module.exports = (config) =>
    withPlugins(config, [
      withFirebaseAndroid,
      withFirebaseProjectGradle,
      withFirebaseManifest,
      withFirebaseIOS,
    ]);