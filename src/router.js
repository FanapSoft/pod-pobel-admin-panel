import Vue from "vue";
import Router from "vue-router";

import RouterView from "@/view/layout/RouterView"

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("@/view/layout/Layout"),
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/view/pages/Dashboard.vue")
        },
        {
          path: "/users",
          name: "users",
          redirect: 'list',
          component: RouterView,
          children: [
            {
              path: "list",
              name: "usersList",
              component: () => import("@/view/pages/users/Users.vue")
            },
            {
              path: ":userId/profile",
              name: "userProfile",
              redirect: "overview",
              component: () => import("@/view/pages/users/Profile.vue"),
              children: [
                {
                  path: "overview",
                  name: "userProfileOverView",
                  component: () => import("@/view/pages/users/Overview.vue")
                },
                {
                  path: "datasets",
                  name: "userProfileDatasetsActivities",
                  component: () => import("@/view/pages/users/Datasets.vue")
                },
                {
                  path: "settings",
                  name: "userProfileSettings",
                  component: () => import("@/view/pages/users/Settings.vue")
                },
              ]
            },
          ]
        },
        {
          path: "/reports",
          name: "reports",
          redirect: 'list',
          component: RouterView,
          children: [
            {
              path: "list",
              name: "reportTypesList",
              component: () => import("@/view/pages/reports/Reports.vue")
            },
            {
              path: "AnswerCountTrend",
              name: "answerCountTrend",
              component: () => import("@/view/pages/reports/AnswersCountTrend.vue")
            },

          ]
        },
        {
          path: "/dataset",
          name: "datasets",
          redirect: 'list',
          component: RouterView,
          children: [
            {
              path: "list",
              name: "datasetsList",
              component: () => import("@/view/pages/dataset/Datasets.vue")
            },
            {
              path: "create",
              name: "createDataset",
              component: () => import("@/view/pages/dataset/CreateDataset.vue")
            },
            {
              path: ":DatasetId/edit",
              name: "editDataset",
              component: () => import("@/view/pages/dataset/EditDataset.vue")
            },
            {
              path: ":DatasetId/singleDataset",
              name: "SingleDataset",
              component: () => import("@/view/pages/dataset/SingleDataset.vue")
            },
            {
              path: ":DatasetId/targets",
              name: "datasetTargets",
              component: () => import("@/view/pages/dataset/Targets.vue")
            },

            {
              path: ":DatasetId/target/:TargetId/edit",
              name: "editDatasetTarget",
              component: () => import("@/view/pages/dataset/EditTarget.vue")
            },
            {
              path: ":DatasetId/target/create",
              name: "createDatasetTarget",
              component: () => import("@/view/pages/dataset/CreateTarget.vue")
            },
          ]
        },
        {
          path: "/datasetitems",
          name: "datasetItems",
          component: () => import("@/view/pages/dataset/DatasetItems.vue")
        },
        {
          path: "/answers",
          name: "Answers",
          component: () => import("@/view/pages/answers/Answers.vue")
        },
        {
          path: "/transaction",
          name: "transactions",
          redirect: 'list',
          component: RouterView,
          children: [
            {
              path: "list",
              name: "transactionsList",
              component: () => import("@/view/pages/transactions/Transactions.vue")
            },
          ]
        },
      ]
    },
    {
      path: "/custom-error",
      name: "error",
      component: () => import("@/view/pages/error/Error.vue"),
      children: [
        {
          path: "error-1",
          name: "error-1",
          component: () => import("@/view/pages/error/Error-1.vue")
        },
        {
          path: "error-2",
          name: "error-2",
          component: () => import("@/view/pages/error/Error-2.vue")
        },
        {
          path: "error-3",
          name: "error-3",
          component: () => import("@/view/pages/error/Error-3.vue")
        },
        {
          path: "error-4",
          name: "error-4",
          component: () => import("@/view/pages/error/Error-4.vue")
        },
        {
          path: "error-5",
          name: "error-5",
          component: () => import("@/view/pages/error/Error-5.vue")
        },
        {
          path: "error-6",
          name: "error-6",
          component: () => import("@/view/pages/error/Error-6.vue")
        }
      ]
    },
    {
      name: "loggedIn",
      path: "/loggedIn/:userId",
      component: null
    },
    {
      path: "*",
      redirect: "/404"
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/view/pages/error/Error-1.vue")
    }
  ]
});
