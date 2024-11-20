package projector_test

import (
	"testing"

	"github.com/OsmarJoseph/projector/go/pkg/projector"
)

func getData() *projector.Data {
	return &projector.Data{
		Projector: map[string]map[string]string{
			"/": {
				"foo": "bar1",
				"fem": "is",
			},
			"/foo": {
				"foo": "bar2",
			},
			"/foo/bar": {
				"foo": "bar3",
			},
		},
	}
}

func getProjector(pwd string, data *projector.Data) *projector.Projector {
	return projector.CreateProjector(&projector.Config{
		Args:      []string{},
		Operation: projector.Print,
		Pwd:       pwd,
		Config:    "",
	}, data)
}

func test(t *testing.T, projector *projector.Projector, key, expectedValue string) {
	value, ok := projector.GetValue(key)

	if !ok {
		t.Errorf("Expected to find value foo")
	}

	if value != expectedValue {
		t.Errorf("Expected value to be %v, got %v", expectedValue, value)
	}
}

func TestGetValue(t *testing.T) {
	data := getData()
	projector := getProjector("/foo/bar", data)

	test(t, projector, "foo", "bar3")
	test(t, projector, "fem", "is")
}

func TestSetValue(t *testing.T) {
	data := getData()
	projector := getProjector("/foo/bar", data)

	test(t, projector, "foo", "bar3")
	projector.SetValue("foo", "bar4")
	test(t, projector, "foo", "bar4")

	projector.SetValue("fem", "is2")
	test(t, projector, "fem", "is2")

	projector = getProjector("/", data)
	test(t, projector, "fem", "is")
}

func TestRemoveValue(t *testing.T) {
	data := getData()
	projector := getProjector("/foo/bar", data)

	test(t, projector, "foo", "bar3")
  projector.RemoveValue("foo")
	test(t, projector, "foo", "bar2")

  projector.RemoveValue("fem")

	test(t, projector, "fem", "is")
}
