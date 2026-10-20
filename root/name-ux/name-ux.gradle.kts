/*
 * Copyright (c) {%= year %} {%= author_name %}. All Rights Reserved.
 */
import com.tridium.gradle.plugins.grunt.task.GruntBuildTask{% if (useRuntimeProfiles) { %}
import com.tridium.gradle.plugins.module.util.ModulePart.RuntimeProfile.*{% } %}

plugins {
  // The Niagara Module plugin configures the "moduleManifest" extension and the
  // "jar" and "moduleTestJar" tasks.
  id("{%= coreModulePlugin %}")

  id("{%= gruntPluginId %}")
  {% if (isThirdParty) { %}
    // The signing plugin configures the correct signing of modules. It requires
    // that the plugin also be applied to the root project.
    id("com.tridium.niagara-signing")

    // Configures JaCoCo for the "niagaraTest" task of this module.
    id("com.tridium.niagara-jacoco")

    // The Annotation processors plugin adds default dependencies on "Tridium:nre"
    // for the "annotationProcessor" and "moduleTestAnnotationProcessor"
    // configurations by creating a single "niagaraAnnotationProcessor"
    // configuration they extend from. This value can be overridden by explicitly
    // declaring a dependency for the "niagaraAnnotationProcessor" configuration.
    id("com.tridium.niagara-annotation-processors")

    // The niagara_home repositories convention plugin configures !bin/ext and
    // !modules as flat-file Maven repositories so that projects in this build can
    // depend on already-installed Niagara modules.
    id("com.tridium.convention.niagara-home-repositories")
    {% } %}
}

description = "{%= description %}"

moduleManifest {
  moduleName.set("{%= name %}")
  preferredSymbol.set("{%= preferredSymbol %}"){% if (useRuntimeProfiles) { %}
  runtimeProfile.set(ux){% } %}
}

// See documentation at module://docDeveloper/doc/build.html#dependencies for the supported
// dependency types
dependencies {
  {% if (isFirstParty) { %}api(project(":{%= toProjectName('js', 'ux') %}")){% } else { %}api("Tridium:{%= toProjectName('js', 'ux') %}"){% }
    if (bajaux && fullClassName) {
      if (isFirstParty) { %}
  api(project(":{%= toProjectName('bajaux', 'ux') %}"))
  api(project(":{%= toProjectName('baja') %}"))
  api(project(":{%= toProjectName('web', 'rt') %}")){% if (fe) { %}
  api(project(":{%= toProjectName('webEditors', 'ux') %}")){% }
      } else { %}
  nre("Tridium:{%= toProjectName('nre') %}")
  api("Tridium:{%= toProjectName('baja') %}")
  api("Tridium:{%= toProjectName('bajaux', 'ux') %}")
  api("Tridium:{%= toProjectName('web', 'rt') %}"){% if (fe) { %}
  api("Tridium:{%= toProjectName('webEditors', 'ux') %}"){% }
      }
    }
    %}
}

tasks.named<Jar>("jar") {
  from("src") {
    include("rc/")
  }
}

tasks.named<Jar>("moduleTestJar") {
  from("srcTest") {
    include("rc/")
  }
}

tasks.named<GruntBuildTask>("gruntBuild") {
  tasks("babel:dist",{% if(less) {%} "less",{%} %} "copy:dist", "requirejs")
}