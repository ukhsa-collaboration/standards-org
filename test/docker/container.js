import assert from 'node:assert/strict';
import {before, after, describe, it} from 'node:test';

import {GenericContainer, Wait} from 'testcontainers';
import {getContainerRuntimeClient} from "testcontainers";
import {ImageName} from "testcontainers";
import {readFileSync} from "fs";

describe('container image tests', async () => {
  const SERVER_PORT = 8080;
  const START_MESSAGE = `[11ty] Server at http://localhost:${SERVER_PORT}/`;
  const DOCS_NAME = 'testing';

  // suite-level var setup in the before step
  let container;

  const getBaseUrl = () => `http://localhost:${container.getMappedPort(SERVER_PORT)}`;

  before(async () => {
    let image;

    // assume we're being run from the root of the repo
    image = await GenericContainer.fromDockerfile("./").build();

    container = await image.withExposedPorts(SERVER_PORT)
      .withWaitStrategy(Wait.forLogMessage(START_MESSAGE))
      // mounting is discouraged by testcontainers, so just directly copy the test docs
      // dir into the container before starting it
      .withCopyDirectoriesToContainer([{
        source: './test/docker/docs',
        target: `/site/docs/${DOCS_NAME}`
      }])
      .start();
  });

  after(async () => await container.stop());

  await it('The home page is accessible', async () => {
    // act
    const resp = await fetch(getBaseUrl());

    // assert
    assert.ok(resp.ok);
  });

  await it('The custom doc pages are accessible', async () => {
    // act
    const resp = await fetch(`${getBaseUrl()}/${DOCS_NAME}/`);

    // assert
    assert.ok(resp.ok);
  });

  await it('The custom doc pages have the expected content', async () => {
    // act
    const resp = await fetch(`${getBaseUrl()}/${DOCS_NAME}/`);

    // assert
    assert.ok((await resp.text()).includes('This is the index page for testing'));
  });
});
